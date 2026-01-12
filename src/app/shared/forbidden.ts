import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forbidden',
  imports: [CommonModule, RouterModule],
  template: `
    <h2>403 - Forbidden</h2>
    <p>Tu n'as pas les droits pour accéder à cette page.</p>
    <a routerLink="/posts">Retour</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Forbidden{}
