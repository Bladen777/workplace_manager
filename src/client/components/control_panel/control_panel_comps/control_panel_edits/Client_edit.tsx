export default function Client_edit() {
  return (
    <div id="client_edit">
       Client_edit
      <form action="/client_edit">
        <input type="text" name="client_name" id="client_name" placeholder="Name" />
        <input type="text" name="client_address" id="client_address" placeholder="Address"/>
        <input type="date" name="client_date" id="client_date" />
        <button id="client_edit_done" type="button"> Done </button>
      </form>
     



    </div>
  )
};
