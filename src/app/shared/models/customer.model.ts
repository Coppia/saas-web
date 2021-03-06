import { ICreated } from './created.interface';
export class Customer implements ICreated {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    image_link: string;
    title: string;
    company_name: string;
    created_by: string;
    created_datetime: Date;
    created_image_link: string;
    updated_by: string;
    updated_datetime: Date;
    updated_image_link: string;
    success: boolean;
    assigned: boolean;
    found: boolean;
}
