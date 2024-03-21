import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';

export interface Item {
  id?: number,
  title?: string,
  price?: number,
  description?: string,
  category?: string,
  image?: string,
  rating?: Rating,
  quantity?: number,
  total?: number
}

export interface Rating {
  rate?: number,
  count?: number
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  public products: any = [];
  public grandTotal!: number;
  cartSubscription!: Subscription;

  constructor(private cartService: CartService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getProducts().subscribe((res) => {
      this.products = res;
      this.grandTotal = this.cartService.getTotalPrice();
    });
  }

  /*
  Function to remove selected item from cart
  */
  removeItem(item: Item): void {
    let componentPayload = {
      action: 'Confirm Remove',
      message: 'Do you want to Remove Item ?',
      data: item,
      type: 'removeItem'
    }
    this.confirmation(componentPayload);
  }

  /*
  Function to remove all items from cart
  */
  clearCart(): void {
    let componentPayload = {
      action: 'Confirm Clear',
      message: 'Do you want to Remove All ?',
      data: 'null',
      type: 'removeAll',
    }
    this.confirmation(componentPayload);
  }

  /**
   * Function for confirmation based on action type
   */
  confirmation(data: any): void {
    this.confirmationService.confirm({
      message: data.message,
      header: data.action,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Confirm",
      rejectLabel: "Cancel",
      accept: () => {
        if (data.type == "removeAll") {
          this.cartService.removeAllCart();
          this.grandTotal = 0;
        } else if (data.type == "removeItem") {
          this.cartService.removeCartItem(data.data);
        }
      },
      reject: (type: any) => { },
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}
