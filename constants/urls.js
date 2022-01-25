export const USER_REFERENCE =
  'http://beta.hackfoldr.org/cofacts/https%253A%252F%252Fhackmd.io%252Fs%252FBJPLbAKwb';
export const PROJECT_HACKFOLDR = 'https://cofacts.tw/hack';
export const EDITOR_REFERENCE =
  'http://beta.hackfoldr.org/cofacts/https%253A%252F%252Fhackmd.io%252Fs%252FSJPAscuP-';
export const EDITOR_FACEBOOK_GROUP =
  'https://www.facebook.com/groups/cofacts/permalink/1959641497601003/';
export const CONTACT_EMAIL = 'cofacts@googlegroups.com';
export const LINE_URL = 'https://line.me/R/ti/p/%40cofacts';
export const PROJECT_SOURCE_CODE =
  'https://beta.hackfoldr.org/1yXwRJwFNFHNJibKENnLCAV5xB8jnUvEwY_oUq-KcETU/https%253A%252F%252Fhackmd.io%252Fs%252Fr1nfwTrgM';
export const PROJECT_MEDIUM = 'https://medium.com/cofacts';
export const DEVELOPER_HOMEPAGE = 'https://hackmd.io/s/r1nfwTrgM';
export const LICENSE_URL = 'https://creativecommons.org/licenses/by-sa/4.0/';
export const USER_AGREEMENT_URL =
  'https://github.com/cofacts/rumors-site/blob/master/LEGAL.md';

// https://developers.facebook.com/docs/sharing/reference/share-dialog#redirect
export const FACEBOOK_SHARE_URL_PREFIX =
  'https://www.facebook.com/dialog/share?app_id=719656818195367&display=popup';

export const DONATION_URL =
  'https://ocf.neticrm.tw/civicrm/contribute/transact?id=48';

/**
 * @param {object} params
 * @param {string} params.userId - spammer's user ID
 * @param {'replyRequest' | 'articleReplyFeedback' | 'reply'} params.itemType - reported spam item type
 * @param {string} params.itemId - reply ID for reply; article ID for replyRequest; article ID,reply ID (separated in comma) for article reply feedback.
 *
 * @returns {string} Pre-filled URL to the google form that reports spam.
 */
export const getSpamReportUrl = ({ userId, itemType, itemId }) => {
  // Prefilled URL as constant, manually edited to become template string
  return `https://docs.google.com/forms/d/e/1FAIpQLSf7d8xCAz682vR3WLRVTxqqbWiFXLd6ShZpOnsXXTmAbPFcUA/viewform?usp=pp_url&entry.1302713624=${userId}&entry.192715150=${itemId}&entry.511781180=${itemType}&entry.1691230719=${location.href}`;
};
