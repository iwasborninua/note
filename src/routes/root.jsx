import {
    Form,
    Link,
    NavLink,
    Outlet,
    useLoaderData,
    redirect,
    useNavigation, useSubmit
} from "react-router-dom";
import {
    createContact,
    getContacts
} from "../contacts.js";
import {useEffect} from "react";

export async function loader({request}) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
    const { contacts, q} = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    useEffect(() => {
        document.getElementById("q").value = q;
    }, [q]);

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                submit(event.currentTarget.form);
                            }}
                            className={searching ? "loading" : ""}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {
                        contacts.length ? (
                            <ul>
                                {contacts.map((contact) => (
                                    <li key={contact.id}>
                                        <NavLink
                                            to={`contacts/${contact.id}`}
                                             className={({isActive, isPending}) =>
                                                 isActive
                                                     ? "active"
                                                     : isPending
                                                         ? "pending"
                                                         : ""
                                        }
                                        >{contact.first ? (contact.last + ' ' + contact.last):(contact.id)}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>No Contact</p>
                    }
                </nav>
            </div>
            <div
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : ""
                }
            >
                <Outlet />
            </div>
        </>
    );
}