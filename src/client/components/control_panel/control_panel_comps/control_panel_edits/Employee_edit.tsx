
// TYPE DEFINITIONS
import { Prop_types_control_panel_edit as Prop_types } from "../../Control_panel.js"


// THE COMPONENT
export default function Employee_edit({submit_method, item_id}:Prop_types) {
  return (
    <div>
      Employee_edit
      <form>
        <input type="text" name="employee_name" id="employee_name" placeholder="Name" />
        <input type="text" name="employee_title" id="employee_title" placeholder="Title" />
        <input type="text" name="employee_rate" id="employee_rate" placeholder="Pay Rate"/>
        <input type="Date" name="employee_date" id="employee_date"/>
        <input type="checkbox" name="employee_admin" id="employee_admin"/>
        <button id="employee_edit_done" type="button"> Done </button>
      </form>

    </div>
  )
}
