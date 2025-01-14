export default function Department_edit() {
  return (
    <div>
         Department_edit
      <form>
        <input type="text" name="department_name" id="department_name" placeholder="Name" />
        <input type="text" name="department_order" id="department_order" />
        <input type="text" name="department_color" id="department_color"/>
        <button id="department_edit_done" type="button"> Done </button>
      </form>
    </div>
  )
}
