<template>
  <div
    class="modal fade"
    id="editModalQuantity="
    tabindex="-1"
    aria-labelledby="editModalLabel="
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Reduce Quantity</h5>
        </div>
        <form>
          <div class="modal-body d-flex justify-content-center">
            <input class="addquan text-center" type="number" id="quantity" name="quantity" />
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-danger btn-sm" data-bs-dismiss="modal">
              Cancel
            </button>
            <button class="btn btn-danger btn-sm mb-1" type="submit" name="add">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
