from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from uuid import UUID  # ← ADD THIS IMPORT
from ....core.database import get_db
from ....core.dependencies import get_current_user
from ....models.user import User
from ....models.order import Order
from ....models.delivery_region import DeliveryRegion
from ....schemas.order import OrderCreate, OrderResponse, OrderListResponse
import uuid

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new order"""
    # Convert delivery_region_id to UUID
    try:
        region_uuid = UUID(order_data.delivery_region_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid delivery region ID format",
        )
    
    # Validate delivery region
    stmt = select(DeliveryRegion).where(
        DeliveryRegion.id == region_uuid,
        DeliveryRegion.is_active == True
    )
    result = await db.execute(stmt)
    region = result.scalar_one_or_none()
    if not region:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid delivery region"
        )
    
    # Generate order number
    order_number = f"HR-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    
    # Calculate estimated delivery date
    estimated_delivery = datetime.now(timezone.utc) + timedelta(days=region.estimated_days)
    
    # Create order
    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        status="pending",
        subtotal=order_data.subtotal,
        delivery_fee=order_data.delivery_fee,
        total_amount=order_data.total_amount,
        payment_method=order_data.payment_method,
        payment_status="pending",
        delivery_region_id=region_uuid,  # ← Use UUID here
        delivery_address=order_data.delivery_address.model_dump(),
        estimated_delivery_date=estimated_delivery,
        configuration_snapshot=order_data.configuration_snapshot,
    )
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    return order

@router.get("/", response_model=OrderListResponse)
async def get_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = 50,
    offset: int = 0,
):
    """Get user's orders with pagination"""
    # Get total count
    count_stmt = select(func.count()).select_from(Order).where(Order.user_id == current_user.id)
    total_result = await db.execute(count_stmt)
    total = total_result.scalar()
    
    # Get orders
    stmt = select(Order).where(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(stmt)
    orders = result.scalars().all()
    
    return {
        "orders": orders,
        "total": total or 0
    }

@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific order by ID"""
    try:
        order_uuid = UUID(order_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID format",
        )
    
    stmt = select(Order).where(
        Order.id == order_uuid,
        Order.user_id == current_user.id
    )
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.post("/{order_id}/payment")
async def simulate_payment(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Simulate payment processing"""
    try:
        order_uuid = UUID(order_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID format",
        )
    
    stmt = select(Order).where(
        Order.id == order_uuid,
        Order.user_id == current_user.id
    )
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    if order.payment_status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid"
        )
    
    # Simulate payment processing (100% success for demo)
    order.payment_status = "completed"
    order.status = "paid"
    await db.commit()
    await db.refresh(order)
    
    return {
        "success": True,
        "message": "Payment successful",
        "order_number": order.order_number,
        "amount": order.total_amount,
        "payment_method": order.payment_method
    }

@router.get("/{order_id}/status")
async def get_order_status(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get order status updates"""
    try:
        order_uuid = UUID(order_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID format",
        )
    
    stmt = select(Order).where(
        Order.id == order_uuid,
        Order.user_id == current_user.id
    )
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return {
        "order_number": order.order_number,
        "status": order.status,
        "payment_status": order.payment_status,
        "estimated_delivery": order.estimated_delivery_date,
        "created_at": order.created_at,
        "updated_at": order.updated_at
    }