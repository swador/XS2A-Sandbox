/*
 * Copyright 2018-2023 adorsys GmbH & Co KG
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version. This program is distributed in the hope that
 * it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see https://www.gnu.org/licenses/.
 *
 * This project is also available under a separate commercial license. You can
 * contact us at psd2@adorsys.com.
 */

import { TppRedirectUri } from './tpp-redirect-uri';
export interface TppInfo {
  /**
   * Issuer CN
   */
  issuerCN: string;

  /**
   * Authorization number
   */
  authorisationNumber: string;

  /**
   * National competent authority name
   */
  authorityName: string;

  /**
   * Cancel TPP redirect URIs
   */
  cancelTppRedirectUri?: TppRedirectUri;

  /**
   * City
   */
  city: string;

  /**
   * Country
   */
  country: string;

  /**
   * National competent authority id
   */
  authorityId: string;

  /**
   * Organisation
   */
  organisation: string;

  /**
   * Organisation unit
   */
  organisationUnit: string;

  /**
   * State
   */
  state: string;

  /**
   * Tpp name
   */
  tppName: string;

  /**
   * Tpp role
   */
  tppRoles: Array<'PISP' | 'AISP' | 'PIISP' | 'ASPSP'>;
}
