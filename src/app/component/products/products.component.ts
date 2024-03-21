import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CartService } from '../../service/cart.service';

interface Category {
  name: string;
  imageUrl: string;
  filterValue: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productList!: any[];
  categories: Category[] = [
    { name: 'All products', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100', filterValue: '' }, // ... denotes image URL
    { name: 'Electronics', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100', filterValue: 'electronics' },
    { name: 'Fashion', imageUrl: 'https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100', filterValue: 'fashion' },
    { name: 'Jewellery', imageUrl: 'https://rukminim1.flixcart.com/image/580/696/kkh6zrk0/jewellery-set/o/w/z/gt-ns-862-matushri-art-original-imafzt9teacakjyn.jpeg?q=50', filterValue: 'jewelery' },
  ];
  
  filteredProducts!: any[];
  searchKey: string = '';

  constructor(private api: ApiService, private cartService: CartService) {}

  ngOnInit(): void {
    this.api.getProduct().subscribe((products: any) => {
      this.productList = products.map((product: any) => {
        return {
          ...product,
          category: this.normalizeCategory(product.category),
          quantity: 1,
          total: product.price,
        };
      });
      this.filteredProducts = this.productList;
    });

    this.cartService.search.subscribe((searchTerm) => {
      this.searchKey = searchTerm;
    });
  }

  normalizeCategory(category: string): string {
    return category.toLowerCase().replace(/men's clothing|women's clothing/g, 'fashion');
  }

  filter(category: string): void {
    this.filteredProducts = category
      ? this.productList.filter((product) => product.category === category)
      : this.productList;
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item);
  }
}