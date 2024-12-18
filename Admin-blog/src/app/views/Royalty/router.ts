import { Routes } from '@angular/router';
import { AuthGuard } from '../../Shared/auth.guard';
import { RoyaltyMonthComponent } from '../Royalty/royaltymonth/royalty-month/royalty-month.component';
import { RoyaltyUserComponent } from '../Royalty/royalty-user/royalty-user.component';
import { TransactionComponent } from '../Royalty/transaction/transaction.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full',
      },
      {
        path: 'royalty-month',
        component: RoyaltyMonthComponent,
        data: {
          title: 'Thống kê tháng',
          requiredPolicy: 'Permissions.Royalty.View',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'royalty-user',
        component: RoyaltyUserComponent,
        data: {
          title: 'Thống kê tác giả',
          requiredPolicy: 'Permissions.Royalty.View',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'transactions',
        component: TransactionComponent,
        data: {
          title: 'Giao dịch',
          requiredPolicy: 'Permissions.Royalty.View',
        },
        canActivate: [AuthGuard],
      },

];

