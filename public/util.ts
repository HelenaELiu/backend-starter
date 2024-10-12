type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea" | "json";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type Operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

/**
 * This list of operations is used to generate the manual testing UI.
 */
const operations: Operation[] = [
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update Password",
    endpoint: "/api/users/password",
    method: "PATCH",
    fields: { currentPassword: "input", newPassword: "input" },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", content: "input", options: { backgroundColor: "input" } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Create Event",
    endpoint: "/api/events",
    method: "POST",
    fields: { name: "input", time: "input", location: "input", price: "input", description: "input" },
  },
  {
    name: "Delete Event",
    endpoint: "/api/events/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Event",
    endpoint: "/api/events/:id",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Get All Events",
    endpoint: "/api/events",
    method: "GET",
    fields: {},
  },
  {
    name: "Update Event",
    endpoint: "/api/events/:id",
    method: "PATCH",
    fields: { id: "input", name: "input", time: "input", location: "input", price: "input", description: "input" },
  },
  {
    name: "Add Event Choreog",
    endpoint: "/api/events/addchoreog/:id",
    method: "PATCH",
    fields: { id: "input", choreog: "input" },
  },
  {
    name: "Delete Event Choreog",
    endpoint: "/api/events/deletechoreog/:id",
    method: "PATCH",
    fields: { id: "input", choreog: "input" },
  },
  {
    name: "Add Event Genre",
    endpoint: "/api/events/addgenre/:id",
    method: "PATCH",
    fields: { id: "input", genre: "input" },
  },
  {
    name: "Delete Event Genre",
    endpoint: "/api/events/deletegenre/:id",
    method: "PATCH",
    fields: { id: "input", genre: "input" },
  },
  {
    name: "Add Event Prop",
    endpoint: "/api/events/addprop/:id",
    method: "PATCH",
    fields: { id: "input", prop: "input" },
  },
  {
    name: "Delete Event Prop",
    endpoint: "/api/events/deleteprop/:id",
    method: "PATCH",
    fields: { id: "input", prop: "input" },
  },
  {
    name: "Add Event Attendee",
    endpoint: "/api/events/addattendee/:id",
    method: "PATCH",
    fields: { id: "input", attendee: "input" },
  },
  {
    name: "Delete Event Attendee",
    endpoint: "/api/events/deleteattendee/:id",
    method: "PATCH",
    fields: { id: "input", attendee: "input" },
  },
  {
    name: "Send Invite",
    endpoint: "/api/invite/:to",
    method: "POST",
    fields: { to: "input", event_id: "input" },
  },
  {
    name: "Remove Invite",
    endpoint: "/api/invite/:to",
    method: "DELETE",
    fields: { to: "input", event_id: "input" },
  },
  {
    name: "Accept Invite",
    endpoint: "/api/invite/accept/:from",
    method: "PUT",
    fields: { from: "input", event_id: "input" },
  },
  {
    name: "Reject Invite",
    endpoint: "/api/invite/reject/:from",
    method: "PUT",
    fields: { from: "input", event_id: "input" },
  },
  {
    name: "Get All Invites",
    endpoint: "/api/invite",
    method: "GET",
    fields: {},
  },
  {
    name: "Create Organization",
    endpoint: "/api/organizations",
    method: "POST",
    fields: { name: "input", description: "input", privacy: "input" },
  },
  {
    name: "Delete Organization",
    endpoint: "/api/organizations/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Update Organization",
    endpoint: "/api/organizations/:id",
    method: "PATCH",
    fields: { id: "input", name: "input", description: "input" },
  },
  {
    name: "Get Organization",
    endpoint: "/api/organizations/:id",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Get All Organizations",
    endpoint: "/api/organizations",
    method: "GET",
    fields: {},
  },
  {
    name: "Add Member",
    endpoint: "/api/organizations/addmember/:id",
    method: "PATCH",
    fields: { id: "input", member: "input" },
  },
  {
    name: "Delete Member",
    endpoint: "/api/organizations/deletemember/:id",
    method: "PATCH",
    fields: { id: "input", member: "input" },
  },
  {
    name: "Make Public",
    endpoint: "/api/organizations/makepublic/:id",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Make Private",
    endpoint: "/api/organizations/makeprivate/:id",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Create Video",
    endpoint: "/api/videos",
    method: "POST",
    fields: { url: "input", description: "input" },
  },
  {
    name: "Get Video",
    endpoint: "/api/videos/:id",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Get All Videos",
    endpoint: "/api/videos",
    method: "GET",
    fields: {},
  },
  {
    name: "Delete Video",
    endpoint: "/api/videos/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Create Map",
    endpoint: "/api/map",
    method: "POST",
    fields: {},
  },
  {
    name: "Get Map",
    endpoint: "/api/map",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Scroll Map",
    endpoint: "/api/map",
    method: "PATCH",
    fields: { id: "input", x_scroll: "input", y_scroll: "input" },
  },
  {
    name: "Make Pin",
    endpoint: "/api/map/pins",
    method: "POST",
    fields: { event_id: "input", x: "input", y: "input" },
  },
  {
    name: "Get Pin Event ID",
    endpoint: "/api/map/pins/:id",
    method: "GET",
    fields: { pin_id: "input" },
  },
  //
  // ...
  //
];

/*
 * You should not need to edit below.
 * Please ask if you have questions about what this test code is doing!
 */

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      const htmlTag = tag === "json" ? "textarea" : tag;
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${htmlTag} name="${prefix}${name}"></${htmlTag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const op = operations.find((op) => op.endpoint === $endpoint && op.method === $method);
  const pairs = Object.entries(reqData);
  for (const [key, val] of pairs) {
    if (val === "") {
      delete reqData[key];
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type = key.split(".").reduce((obj, key) => obj[key], op?.fields as any);
    if (type === "json") {
      reqData[key] = JSON.parse(val as string);
    }
  }

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
