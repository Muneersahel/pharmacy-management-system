import { ClientEndpoints } from './core/enums/endpoints';
import { Link } from './core/interfaces/link.interface';

export const pharmacistNavigationLinks: Link[] = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        route: ClientEndpoints.DASHBOARD,
    },
    {
        label: 'Drugs & Supplies',
        icon: 'vaccines',
        route: ClientEndpoints.DRUGS,
    },
];

export const adminNavigationLinks: Link[] = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        route: ClientEndpoints.DASHBOARD,
    },
    {
        label: 'Users',
        icon: 'groups',
        route: ClientEndpoints.USERS,
    },
    {
        label: 'User Roles',
        icon: 'manage_accounts',
        route: ClientEndpoints.USER_ROLES,
    },
];
