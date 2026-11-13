import { configure } from "@solidjs/testing-library";
import { flush } from "solid-js";

configure({
  eventWrapper: (dispatch) => {
    const result = dispatch();
    flush();
    return result;
  },
});
