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

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ConsentAuthorizeResponse } from '../../api/models/consent-authorize-response';
import { RoutingPath } from '../../common/models/routing-path.model';
import { AisService } from '../../common/services/ais.service';
import { CustomizeService } from '../../common/services/customize.service';
import { ShareDataService } from '../../common/services/share-data.service';

import { takeUntil } from 'rxjs/operators';
import { ErrorDialogComponent } from '../../common/dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-tan-confirmation',
  templateUrl: './tan-confirmation.component.html',
  styleUrls: ['./tan-confirmation.component.scss'],
})
export class TanConfirmationComponent implements OnInit, OnDestroy {
  public authResponse: ConsentAuthorizeResponse;
  public tanForm: UntypedFormGroup;
  public invalidTanCount = 0;

  private unsubscribe = new Subject<void>();
  private operation: string;
  private oauth2Param: boolean;

  constructor(
    public customizeService: CustomizeService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private aisService: AisService,
    private shareService: ShareDataService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.initTanForm();

    this.shareService.currentOperation
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((operation: string) => {
        this.operation = operation;
      });

    this.shareService.currentData
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data) {
          console.log('response object: ', data);
          this.authResponse = data;
        }
      });

    this.shareService.oauthParam
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((oauth2: boolean) => {
        this.oauth2Param = oauth2;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public onSubmit(): void {
    // if (!this.authResponse) {
    //   return;
    // }

    this.aisService
      .authrizedConsent({
        ...this.tanForm.value,
        encryptedConsentId: this.authResponse.encryptedConsentId,
        authorisationId: this.authResponse.authorisationId,
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (authResponse) => {
          this.router
            .navigate(
              [`${RoutingPath.ACCOUNT_INFORMATION}/${RoutingPath.RESULT}`],
              {
                queryParams: {
                  encryptedConsentId: this.authResponse.encryptedConsentId,
                  authorisationId: this.authResponse.authorisationId,
                  oauth2: this.oauth2Param,
                },
              }
            )
            .then(() => {
              this.authResponse = authResponse;
              this.shareService.changeData(this.authResponse);
            });
        },
        () => {
          this.invalidTanCount++;

          if (this.invalidTanCount >= 3) {
            this.tanForm.disable();

            this.dialog.open(ErrorDialogComponent, {
              height: '300px',
              width: '350px',
              data: {
                heading: 'Wrong Tan',
                description:
                  'Incorrect TAN was entered 3 times. Your authorisation is failed, please start a new one. After pushing Cancel button you will be logged out. Please restart your authorisation.',
              },
            });
          }
        }
      );
  }

  public onCancel(): void {
    if (this.invalidTanCount >= 3) {
      this.authService.logout();
    } else {
      this.aisService
        .revokeConsent({
          encryptedConsentId: this.authResponse.encryptedConsentId,
          authorisationId: this.authResponse.authorisationId,
        })
        .subscribe((authResponse) => {
          console.log(authResponse);
          this.router
            .navigate(
              [`${RoutingPath.ACCOUNT_INFORMATION}/${RoutingPath.RESULT}`],
              {
                queryParams: {
                  encryptedConsentId: this.authResponse.encryptedConsentId,
                  authorisationId: this.authResponse.authorisationId,
                },
              }
            )
            .then(() => {
              this.authResponse = authResponse;
              this.shareService.changeData(this.authResponse);
            });
        });
    }
  }

  private initTanForm(): void {
    this.tanForm = this.formBuilder.group({
      authCode: ['', Validators.required],
    });
  }
}
