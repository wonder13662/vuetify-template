import common from './common';
import deliveryChannel from './deliveryChannel';
import customerServiceTicketChannel from './customerServiceTicketChannel';

export const COMMON_CLIENT = common.EVENT.CLIENT;

export const DELIVERY_CHANNEL_NAME = deliveryChannel.CHANNEL;
export const DELIVERY_CHANNEL_CLIENT = deliveryChannel.EVENT.CLIENT;
export const DELIVERY_CHANNEL_ROOM = deliveryChannel.EVENT.ROOM;

export const CSTICKET_CHANNEL_NAME = customerServiceTicketChannel.CHANNEL;
export const CSTICKET_CHANNEL_CLIENT = customerServiceTicketChannel.EVENT.CLIENT;
export const CSTICKET_CHANNEL_ROOM = customerServiceTicketChannel.EVENT.ROOM;
