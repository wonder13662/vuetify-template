import {
  COMMON_CLIENT,
  DELIVERY_CHANNEL_NAME,
  DELIVERY_CHANNEL_CLIENT,
  DELIVERY_CHANNEL_ROOM,
  CSTICKET_CHANNEL_NAME,
  CSTICKET_CHANNEL_CLIENT,
  CSTICKET_CHANNEL_ROOM,
} from './socket';
import dictionary from './dictionary';
import alert from './alert';
import customerServiceTicket from './customerServiceTicket';
import delivery from './delivery';
import directorGroup from './directorGroup';
import driverGroup from './driverGroup';
import periodOptionFeeType from './periodOptionFeeType';
import physicalGroup from './physicalGroup';
import resource from './resource';
import rule from './rule';
import servicerUser from './serviceUser';
import utils from '@/lib/utils';

/* eslint-disable max-len */
export const RESOURCE_DELIVERY = resource.DELIVERY;
export const RESOURCE_SUBDELIVERY = resource.SUBDELIVERY;
export const RESOURCE_CSTICKET = resource.CSTICKET;

export const CUSTOMER_SERVICE_TICKET_STATUS = customerServiceTicket.STATUS;

export const DELIVERY_STATUS = delivery.STATUS.MAIN_STATUS;
export const SUBDELIVERY_STATUS = delivery.STATUS.SUB_STATUS;

export const PHYSICALGROUP_TYPE = physicalGroup.TYPE;
export const PHYSICALGROUP_WEATHER = physicalGroup.WEATHER;
export const PHYSICALGROUP_TRAFFIC = physicalGroup.TRAFFIC;
export const PHYSICALGROUP_DELIVERY_VOLUME = physicalGroup.DELIVERY_VOLUME;

export const SOCKET_EVENT_COMMON_CLIENT = COMMON_CLIENT;

export const SOCKET_EVENT_DELIVERY_CHANNEL_NAME = DELIVERY_CHANNEL_NAME;
export const SOCKET_EVENT_DELIVERY_CHANNEL_CLIENT = DELIVERY_CHANNEL_CLIENT;
export const SOCKET_EVENT_DELIVERY_CHANNEL_ROOM = DELIVERY_CHANNEL_ROOM;

export const SOCKET_EVENT_CSTICKET_CHANNEL_NAME = CSTICKET_CHANNEL_NAME;
export const SOCKET_EVENT_CSTICKET_CHANNEL_CLIENT = CSTICKET_CHANNEL_CLIENT;
export const SOCKET_EVENT_CSTICKET_CHANNEL_ROOM = CSTICKET_CHANNEL_ROOM;

export const DICTIONARY_I18N_FORMAT_DELIVERY_STATUS = dictionary.delivery.STATUS;
export const DICTIONARY_I18N_FORMAT_DELIVERY_TYPE = dictionary.delivery.TYPE;
export const DICTIONARY_I18N_FORMAT_DELIVERY_PAYMENT_METHOD = dictionary.delivery.PAYMENT_METHOD;

export const DICTIONARY_I18N_FORMAT_SUBDELIVERY_STATUS = dictionary.subDelivery.STATUS;
export const DICTIONARY_I18N_FORMAT_SUBDELIVERY_PAYMENT_METHOD = dictionary.subDelivery.PAYMENT_METHOD;

export const DICTIONARY_I18N_FORMAT_CSTICKET_TYPE = dictionary.csTicket.TYPE;
export const DICTIONARY_I18N_FORMAT_CSTICKET_STATUS = dictionary.csTicket.STATUS;

export const DICTIONARY_I18N_FORMAT_DRIVER_STATUS = dictionary.driver.STATUS;
export const DICTIONARY_I18N_FORMAT_DRIVER_TRANSPORTATION = dictionary.driver.TRANSPORTATION;

export const SERVICEUSER_APPROVE_STATUS = servicerUser.APPROVE_STATUS;
export const SERVICEUSER_APPROVE_STATUS_SET = utils.convertObjToSet(SERVICEUSER_APPROVE_STATUS);

export const DRIVER_GROUP__TRANSPORTATION = driverGroup.DRIVER_GROUP_SYSTEM_NAME.TRANSPORTATION;
export const DRIVER_GROUP__GRADE = driverGroup.DRIVER_GROUP_SYSTEM_NAME.GRADE;
export const DRIVER_GROUP__MANAGEMENT = driverGroup.DRIVER_GROUP_SYSTEM_NAME.MANAGEMENT;

export const PERIOD_OPTION_FEE_STATUS = periodOptionFeeType.STATUS;
export const PERIOD_OPTION_FEE_STATUS_SET = utils.convertObjToSet(PERIOD_OPTION_FEE_STATUS);

export const DIRECTOR_GROUP__PAGE_MODE = directorGroup.PAGE_MODE;
export const DIRECTOR_GROUP__PAGE_MODE_SET = utils.convertObjToSet(DIRECTOR_GROUP__PAGE_MODE);

export const ALERT_TYPE = alert.TYPE;
export const ALERT_TYPE_LIST = utils.convertObjValuesToList(alert.TYPE);

export const RULE_KEY = rule;
export const RULE_KEY_SET = utils.convertObjToSet(RULE_KEY);
