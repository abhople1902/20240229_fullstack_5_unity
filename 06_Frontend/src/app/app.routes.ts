import { Routes } from '@angular/router';

// Importing the page components
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SearchpageComponent } from './pages/searchpage/searchpage.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductComponent } from './pages/product/product.component';
import { MyOrdersBuyersComponent } from './pages/my-orders-buyers/my-orders-buyers.component';
import { MyOrdersSellerComponent } from './pages/my-orders-seller/my-orders-seller.component';
import { InventoryManagementComponent } from './pages/inventory-management/inventory-management.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { SellerDashboardComponent } from './pages/seller-dashboard/seller-dashboard.component';
import { OrderDetailsBuyerComponent } from './components/order-details-buyer/order-details-buyer.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { MainComponent } from './components/main/main.component';
import { HomepageMaincontentComponent } from './components/homepage-maincontent/homepage-maincontent.component';
import { ImageCarousalComponent } from './components/image-carousal/image-carousal.component';
export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'product', component: HomepageComponent },
    { path: 'myorderbuyer', component: MyOrdersBuyersComponent },
    { path: 'myorderseller', component: MyOrdersSellerComponent },
    { path: 'inventory', component: InventoryManagementComponent },
    { path: 'login', component: LoginComponent },
    // Register for user
    { path: 'register', component: RegisterComponent},
    // Register for seller
    { path: 'register-seller', component: RegisterComponent, data: { userRole: "seller" } },
    // Checkout
    { path: 'checkout', component: CheckoutPageComponent },
    // Seller's Dashboard
    { path: 'seller/home', component: SellerDashboardComponent },
    { path: 'search', component: SearchpageComponent },
    { path: 'orderDetails', component: OrderDetailsBuyerComponent },
    { path: 'add', component: AddproductComponent },
    { path: 'detail', component: ImageCarousalComponent },
   
];
