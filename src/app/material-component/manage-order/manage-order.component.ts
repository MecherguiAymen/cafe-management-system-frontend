import { taggedTemplate } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  displayedColumns : string[] =['name' , 'category' , 'price' , 'quantity' , 'total' , 'edit'];
  dataSource:any = [];
  manageOrderForm:any = FormGroup;
  ctegorys:any =[];
  products:any =[];
  price:any;
  totalAmount:number = 0;
  responseMessage:any;


  constructor(private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    private productService:ProductService,
    private snackBarService:SnackbarService,
    private billService:BillService,
    private ngxService:NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategories();
    this.manageOrderForm = this.formBuilder.group({
      name: [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null,[Validators.required,Validators.pattern(GlobalConstants.contacNumberRegex)]],
      payementMethod: [null,[Validators.required]],
      product: [null,[Validators.required]],
      category: [null,[Validators.required]],
      quantity: [null,[Validators.required]],
      price: [null,[Validators.required]],
      total: [null,[Validators.required]]
    })
  }
  getCategories() {
    this.categoryService.getFilteredCategories().subscribe((response:any)=>{
      this.ngxService.stop();
      this.ctegorys = response;
    
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }
  getProductsByCategory(value:any){
    this.productService.getProductByCategory(value.id).subscribe((response:any)=>{
      this.products =response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((response:any)=>{
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price * 1);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  setQuantity(value:any){
    var temp = this.manageOrderForm.controls['quantity'].value;
    if(temp > 0){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }else if (temp != ''){
      this.manageOrderForm.controls['quantity'].setValue('1'); 
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);

    }
  }

  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value === 0 ||
       this.manageOrderForm.controls['total'].value === null ||
       this.manageOrderForm.controls['quantity'].value <= 0){
         return true;
    } else{
      return false;
    }
  }

  validateSubmit(){
    if(this.totalAmount === 0 ||
       this.manageOrderForm.controls['name'].value === null ||
       this.manageOrderForm.controls['email'].value === null ||
       this.manageOrderForm.controls['contactNumber'].value === null ||
       this.manageOrderForm.controls['payementMethod'].value === null){
          return true;
       }else{
          return false;
       }
  }
  add(){
    var formDate = this.manageOrderForm.value;
    var productName = this.dataSource.find((e:{id:number})=>e.id === formDate.product.id);
    if(productName === undefined){
    this.totalAmount = this.totalAmount + formDate.total;
    this.dataSource.push({id:formDate.product.id,
      name:formDate.product.name,
      category:formDate.category.name,
      price:formDate.price,
      quantity:formDate.quantity,
      total:formDate.total});
      this.dataSource = [...this.dataSource];
      this.snackBarService.openSnackBar(GlobalConstants.productAdded,"success");
    }else{
      this.snackBarService.openSnackBar(GlobalConstants.productExistError,GlobalConstants.error);
    }
  }

  handleDeleteAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  } 

  submitAction(){
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      payementMethod: formData.payementMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    }
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;

    }
    ,(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }
  downloadFile(fileName: string) {

    var data = {
      uuid : fileName
    }
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,fileName + '.pdf');
      this.ngxService.stop();
    })
  }
}
