"use client"; // Marking as a Client Component

import React, { useState } from "react";
import ActionButton from "@/components/ActionButton";
import { UserDataProps } from "@/types/customTypes";

export default function InsectForm({ userData }: UserDataProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [hasWings, setHasWings] = useState<boolean>(false);
    const [hasAntennae, setHasAntennae] = useState<boolean>(false);
    const [hasPatterns, setHasPatterns] = useState<boolean>(false);
    const [hasLegs, setHasLegs] = useState<boolean>(false);
    const [hasSegments, setHasSegments] = useState<boolean>(false);
    
    console.log(userData)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Extract data from FormData object
        const insectData: any = {
            body: {
                bodyShape: formData.get("bodyShape"),
                bodySize: formData.get("bodySize"),
                bodyColor: formData.get("bodyColor"),
                patternDescription: formData.get("patternDescription"),
                segmentCount: formData.get("segmentCount"),
            },
            wings: {
                wingSize: formData.get("wingSize"),
                wingColor: formData.get("wingColor"),
                wingPattern: formData.get("wingPattern"),
            },
            antennae: {
                antennaeLength: formData.get("antennaeLength"),
                antennaeColor: formData.get("antennaeColor"),
            },
            legs: {
                legCount: formData.get("legCount"),
                legSize: formData.get("legSize"),
                legColor: formData.get("legColor"),
            },
            behaviour: {
                movement: formData.get("movement"),
                activityTime: formData.get("activityTime"),
            },
            environment: {
                weather: formData.get("weather"),
                humidity: formData.get("humidity"),
                locationFound: formData.get("locationFound"),
            },
            smell: {
                scent: formData.get("scent"),
                earthySmell: formData.get("earthySmell"),
                sweetSmell: formData.get("sweetSmell"),
                sourSmell: formData.get("sourSmell"),
            },
        };
    
        console.log(insectData, "insectData");
        setLoading(false)
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Body */}
            <h3>Body</h3>
            <div>
                <input type="text" name="bodyShape" placeholder="Body Shape" className="w-full" required />
            </div>
            <div>
                <input type="text" name="bodySize" placeholder="Body Size (mm)" className="w-full" required />
            </div>
            <div>
                <input type="text" name="bodyColor" placeholder="Body Color" className="w-full" required />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="hasPatterns"
                        onChange={(e) => setHasPatterns(e.target.checked)}
                    />{" "}
                    Has Patterns
                </label>
            </div>
            {hasPatterns && (
                <div>
                    <input type="text" name="patternDescription" placeholder="Pattern Description" className="w-full" />
                </div>
            )}
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="hasSegments"
                        onChange={(e) => setHasSegments(e.target.checked)}
                    />{" "}
                    Has Segments
                </label>
            </div>
            {hasSegments && (
                <div>
                    <input type="number" name="segmentCount" placeholder="Segment Count" className="w-full" />
                </div>
            )}

            {/* Wings */}
            <h3>Wings</h3>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="hasWings"
                        onChange={(e) => setHasWings(e.target.checked)}
                    />{" "}
                    Has Wings
                </label>
            </div>
            {hasWings && (
                <>
                    <div>
                        <input type="number" name="wingSize" placeholder="Wing Size (mm)" className="w-full" />
                    </div>
                    <div>
                        <input type="text" name="wingColor" placeholder="Wing Color" className="w-full" />
                    </div>
                    <div>
                        <input type="text" name="wingPattern" placeholder="Wing Pattern" className="w-full" />
                    </div>
                </>
            )}

            {/* Antennae */}
            <h3>Antennae</h3>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="hasAntennae"
                        onChange={(e) => setHasAntennae(e.target.checked)}
                    />{" "}
                    Has Antennae
                </label>
            </div>
            {hasAntennae && (
                <>
                    <div>
                        <input type="number" name="antennaeLength" placeholder="Antennae Length (mm)" className="w-full" />
                    </div>
                    <div>
                        <input type="text" name="antennaeColor" placeholder="Antennae Color" className="w-full" />
                    </div>
                </>
            )}

            {/* Legs */}
            <h3>Legs</h3>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="hasLegs"
                        onChange={(e) => setHasLegs(e.target.checked)}
                    />{" "}
                    Has Legs
                </label>
            </div>
            {hasLegs && (
                <>
                    <div>
                        <input type="number" name="legCount" placeholder="Number of Legs" className="w-full" />
                    </div>
                    <div>
                        <input type="text" name="legSize" placeholder="Leg Size (mm)" className="w-full" />
                    </div>
                    <div>
                        <input type="text" name="legColor" placeholder="Leg Color" className="w-full" />
                    </div>
                </>
            )}

            {/* Behavior */}
            <h3>Behavior</h3>
            <div>
                <input type="text" name="movement" placeholder="Movement (e.g., flying, crawling)" className="w-full" required />
            </div>
            <div>
                <input type="text" name="activityTime" placeholder="Activity Time (e.g., daytime, nighttime)" className="w-full" required />
            </div>

            {/* Environmental Conditions */}
            <h3>Environmental Conditions (Feels Like)</h3>
            <div>
                <input type="text" name="weather" placeholder="Weather (e.g. raining, sunny but cold, cloudy and humid)" className="w-full" required />
            </div>
            <div>
                <input type="text" name="humidity" placeholder="Humidity level (e.g. high, low)" className="w-full" required />
            </div>
            <div>
                <input type="text" name="locationFound" placeholder="Found in (e.g., gully, urban area, rock shelf)" className="w-full" required />
            </div>

            {/* Smell */}
            <h3>Smell (If any)</h3>
            <div className="space-x-3">
                <label>
                    <input type="checkbox" name="earthySmell" /> Earthy
                </label>
                <label>
                    <input type="checkbox" name="sweetSmell" /> Sweet
                </label>
                <label>
                    <input type="checkbox" name="sourSmell" /> Sour
                </label>
            </div>
            <div>
                <input type="text" name="scent" placeholder="Scent (e.g. pungent, like vanilla, rotten)" className="w-full" />
            </div>
            <div>
                <ActionButton label="Mark" loading={loading} />
            </div>
        </form>
    );
}
