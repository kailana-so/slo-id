"use client"

export default function Identify() {
    return (
        <section>
            <div className="card">
                <h4> Use tools to accurately identify your notes.</h4>
                <p> In keeping with the slow method, 1 active drafts limit.</p>
            </div>
        </section>
    )
}

//  identity payload needs a key isConfirmedID bool
//  when a user passes a note from "notes" to "identify" 
//  the note will be stored in memory, until the user makes an update and saves
//  on save the note will be stoore in "identifications" as a draft 
//  isConfirmedID = false

//  pins will be split ebtween notes, IDs and drafts


// tools
// based on "type" if would be ideal to query
// "bird", "insect", "reptile", "plant" API for scientific names
//  user must search via a common name mathc for a scientific name
