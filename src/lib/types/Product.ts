import type { ObjectId } from "mongodb";
import type { Timestamps } from "./Timestamps";

export interface Product extends Timestamps {
	_id: ObjectId;
	source?: string;
	country?: string;
	category?: string;
	gender?: string;
	type?: string;
	product_name?: string;
	price?: number;
	description?: string;
	image_url?: string;
	product_url?: string;
	start_date?: string;
	end_date?: string;
	normalized_product_name?: string;
}
