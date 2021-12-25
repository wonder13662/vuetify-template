import {
  COMMON_CLIENT,
  DELIVERY_CHANNEL_NAME,
  DELIVERY_CHANNEL_CLIENT,
  DELIVERY_CHANNEL_ROOM,
  CSTICKET_CHANNEL_NAME,
  CSTICKET_CHANNEL_CLIENT,
  CSTICKET_CHANNEL_ROOM,
} from './socket';
import alert from './alert';
import dictionary from './dictionary';
import customerServiceTicket from './customerServiceTicket';
import delivery from './delivery';
import directorGroup from './directorGroup';
import resource from './resource';
import physicalGroup from './physicalGroup';
import servicerUser from './serviceUser';
import driverGroup from './driverGroup';

const createMapByReduce = (acc, v) => {
  if (!acc[v]) {
    acc[v] = v;
    return acc;
  }
  return acc;
};

/* eslint-disable max-len */
export const RESOURCE_DELIVERY = resource.DELIVERY;
export const RESOURCE_SUBDELIVERY = resource.SUBDELIVERY;
export const RESOURCE_CSTICKET = resource.CSTICKET;

export const CUSTOMER_SERVICE_TICKET_STATUS = customerServiceTicket.STATUS;

export const DELIVERY_STATUS = delivery.STATUS.MAIN_STATUS;
export const SUBDELIVERY_STATUS = delivery.STATUS.SUB_STATUS;

export const PHYSICALGROUP_TYPE = physicalGroup.TYPE;
export const PHYSICALGROUP_TYPE_MAP = Object.values(PHYSICALGROUP_TYPE).reduce(createMapByReduce, {});
export const PHYSICALGROUP_WEATHER = physicalGroup.WEATHER;
export const PHYSICALGROUP_WEATHER_MAP = Object.values(PHYSICALGROUP_WEATHER).reduce(createMapByReduce, {});
export const PHYSICALGROUP_TRAFFIC = physicalGroup.TRAFFIC;
export const PHYSICALGROUP_TRAFFIC_MAP = Object.values(PHYSICALGROUP_TRAFFIC).reduce(createMapByReduce, {});
export const PHYSICALGROUP_DELIVERY_VOLUME = physicalGroup.DELIVERY_VOLUME;
export const PHYSICALGROUP_DELIVERY_VOLUME_MAP = Object.values(PHYSICALGROUP_DELIVERY_VOLUME).reduce(createMapByReduce, {});

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
export const SERVICEUSER_APPROVE_STATUS_SET = Array.from(Object.values(servicerUser.APPROVE_STATUS)).reduce((acc, v) => (acc.add(v)), new Set());

export const DRIVER_GROUP__TRANSPORTATION = driverGroup.DRIVER_GROUP_SYSTEM_NAME.TRANSPORTATION;
export const DRIVER_GROUP__GRADE = driverGroup.DRIVER_GROUP_SYSTEM_NAME.GRADE;
export const DRIVER_GROUP__MANAGEMENT = driverGroup.DRIVER_GROUP_SYSTEM_NAME.MANAGEMENT;

export const DIRECTOR_GROUP__PAGE_MODE = directorGroup.PAGE_MODE;
export const DIRECTOR_GROUP__PAGE_MODE_SET = Array.from(Object.values(directorGroup.PAGE_MODE)).reduce((acc, v) => (acc.add(v)), new Set());

export const ALERT_TYPE = alert.TYPE;
export const ALERT_TYPE_LIST = Array.from(Object.values(alert.TYPE));
