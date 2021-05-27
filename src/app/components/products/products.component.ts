import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import {of} from 'rxjs/';
import { Product } from 'src/app/model/product.model';
import { ProductsService } from 'src/app/services/products.services';
import { AppDataState, DataStateEnum } from 'src/app/state/product.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  // products?: Product[];
  products$!: Observable<AppDataState<Product[]>>;
  readonly DataStateEnum=DataStateEnum;

  constructor(private productsService: ProductsService, private router: Router) { }

  ngOnInit(): void {
  }


  // onGetAllProducts(){
  //   this.productsService.getAllProducts().subscribe(data => {
  //     this.products = data;
  //   }, err=>{console.log(err)})
  // }

  // onGetAllProducts(){
  //     this.products$ = this.productsService.getAllProducts().pipe(
  //       map((data)=>({dataState: DataStateEnum.LOADED}))
  //     );
  //  }
  onGetAllProducts(){
    this.products$ = this.productsService.getAllProducts().pipe(
      map((data)=>({dataState: DataStateEnum.LOADED, data:data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }
  onGetSelectedProducts(){
    this.products$ = this.productsService.getSelectedProducts().pipe(
      map((data)=>({dataState: DataStateEnum.LOADED, data:data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }
  onGetAvailableProducts(){
    this.products$ = this.productsService.getAvailableProducts().pipe(
      map((data)=>({dataState: DataStateEnum.LOADED, data:data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }

  onSearch(value:any){
    this.products$ = this.productsService.searchProducts(value.keyword).pipe(
      map((data)=>({dataState: DataStateEnum.LOADED, data:data})),
      startWith({dataState: DataStateEnum.LOADING}),
      catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
    );
  }
  onSelect(p: Product){
    this.productsService.select(p).subscribe(data=>{
      p.selected=data.selected;
    })
  }

  onDelete(p: Product){
    let v=confirm("Etes-vous sur?");
    if(v==true)
    this.productsService.deleteProduct(p).subscribe(data=>{
      this.onGetAllProducts();
    })
  }
  onNewProduct(){
    this.router.navigateByUrl("/newProduct")
  }
}
