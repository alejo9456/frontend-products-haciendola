import { Component, OnInit } from '@angular/core';
import { editHtmlConfigDos } from '../../config/editorHtml';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { pluck, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {


  protected editorConfig = editHtmlConfigDos;
  protected product: any;
  protected isUpdating: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>  
          this.productService.getProduct(params.get('id')!)
        )
      )
      .subscribe((product) => {
        this.product = product;
        this.productForm.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          sku: product.sku,
          grams: product.grams,
          stock: product.stock,
          compare_price: product.compare_price,
          barcode: product.barcode,
        });        
    });
  }

  productForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    sku: ['', Validators.required],
    grams: [0, Validators.required],        
    stock: [''],      
    compare_price: [0, Validators.required], 
    barcode: [''],
    userId: [''],
  });

  save() {
    if (this.isUpdating) {
      return;
    }
    
    this.isUpdating = true;

    const productData = {
        title: this.productForm.value.title,
        description: this.productForm.value.description,
        price: parseFloat(this.productForm.value.price),
        sku: this.productForm.value.sku,
        grams: parseFloat(this.productForm.value.grams),
        stock: parseInt(this.productForm.value.stock),
        compare_price: parseFloat(this.productForm.value.compare_price),
        barcode: this.productForm.value.barcode,
    };
  
    this.productService.updateProduct(this.product.id, productData)
    .subscribe(() => {
        this.snackBar.open('Producto actualizado correctamente', 'Cerrar', {
            duration: 2000,
            verticalPosition: 'top',
        });
        this.router.navigate(['/dashboard/productos']);
        this.isUpdating = false;
    }, () => {
        this.isUpdating = false;
    });
  }
}


