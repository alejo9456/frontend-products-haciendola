import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../../auth/services/auth.service';
import { editHtmlConfigDos } from '../../config/editorHtml';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

    protected editorConfig = editHtmlConfigDos;
    protected idUser: string = '';
    protected isPosibleToSave: boolean = true;
    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
      ) {}
      
    ngOnInit(): void {
       this.authService
        .getUserId( this.authService.user )
        .subscribe((user: any) => {
            this.idUser = user.userId;
            console.log(this.idUser, "inciando");
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
        const productData = {
            title: this.productForm.value.title,
            description: this.productForm.value.description,
            price: parseFloat(this.productForm.value.price),
            sku: this.productForm.value.sku,
            grams: parseFloat(this.productForm.value.grams),
            stock: parseInt(this.productForm.value.stock),
            compare_price: parseFloat(this.productForm.value.compare_price),
            barcode: this.productForm.value.barcode,
            userId: this.idUser
        };

        this.productService.createProduct(productData)
        .subscribe(() => {
            this.isPosibleToSave = true;
            this.snackBar.open('Producto creado correctamente', 'Cerrar', {
                duration: 2000,
                verticalPosition: 'top',
            });
            this.router.navigate(['/dashboard/productos']);
        });
    }
}
