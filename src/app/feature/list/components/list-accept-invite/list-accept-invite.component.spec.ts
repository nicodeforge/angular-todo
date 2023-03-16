import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcceptInviteComponent } from './list-accept-invite.component';

describe('ListAcceptInviteComponent', () => {
  let component: ListAcceptInviteComponent;
  let fixture: ComponentFixture<ListAcceptInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAcceptInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAcceptInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
