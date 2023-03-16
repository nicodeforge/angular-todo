import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TodoAddComponent } from "./components/todo-add/todo-add.component";
import { TodoListComponent } from "./components/todo-list/todo-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TodoHistoryComponent } from "./components/todo-history/todo-history.component";
import { DateInputConverter } from "./directives/date-input-converter.directive";
import { CopyClipboardDirective } from "./directives/copy-clipboard.directive";

@NgModule({
  declarations: [
    DateInputConverter,
    CopyClipboardDirective,
    TodoAddComponent,
    TodoListComponent,
    TodoHistoryComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    TodoAddComponent,
    TodoListComponent,
    TodoHistoryComponent,
    CopyClipboardDirective,
  ],
})
export class SharedModule {}
