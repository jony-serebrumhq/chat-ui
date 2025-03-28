import {
	endpointSupplementFlow,
	endpointSupplementFlowParametersSchema,
} from "./custom/supplementFlowCustom";

export const endpointSchemas = {
	supplementFlow: endpointSupplementFlowParametersSchema,
} as const;

export const endpoints = {
	supplementFlow: endpointSupplementFlow,
} as const;
