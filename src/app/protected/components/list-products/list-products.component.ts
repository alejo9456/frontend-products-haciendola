import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../interfaces/product'; 
import { ProductService } from '../../services/product.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, pluck } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css'],
})
export class ListProductsComponent implements OnInit {
  dataSource = new MatTableDataSource<Product>();
  displayedColumns: string[] = ['id', 'title', 'stock', 'editar', 'eliminar'];
  totalProducts = 0;
  pageSize = 10;
  currentPage = 0;
  isLoadingResults = true;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts(this.currentPage, this.pageSize);
  }

  loadProducts(limit: number, page: number) {
    this.isLoadingResults = true;
    this.productService.getProducts(limit, page + 1).subscribe({
      next: (response) => {
        this.dataSource.data = response.items;
        this.totalProducts = response.meta.totalItems;
        this.isLoadingResults = false;
      },
      error: () => {
        this.isLoadingResults = false;
      },
    });
  }

  openModal(id: string): void {
    const modalRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
    });
    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.productService.getProducts(
            this.pageSize, this.currentPage
          )
          .pipe(
            tap((res) => (this.totalProducts = res.meta.totalItems)),
            pluck('items')
          )
          .subscribe((data) => {
            this.dataSource = data;
            this.isLoadingResults = false;
          });
        });
      }
    });
  }

  openSnackBartoDelete() {
    this.snackBar.open('Producto eliminada', 'Hecho', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  closeSession(){
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    if (this.currentPage < event.pageIndex) {
      this.currentPage = event.pageIndex;
    } else if (this.currentPage > event.pageIndex) {
      this.currentPage = event.pageIndex;
    }
    this.loadProducts(this.pageSize, this.currentPage);
  }

  eliminarProducto(id: string) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts(this.pageSize, this.currentPage);
    });
  }
}
