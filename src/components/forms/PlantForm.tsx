"use client"; // Marking as a Client Component

import React, { useState } from "react";
import ActionButton from "@/components/ActionButton";
import { UserDataProps } from "@/types/customTypes";

export default function PlantForm({ userData }: UserDataProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [hasSegments, setHasSegments] = useState<boolean>(false);
    const [hasBranch, setHasBranch] = useState<boolean>(false);
    const [hasStem, setHasStem] = useState<boolean>(false);
    const [hasFruits, setHasFruits] = useState<boolean>(false);
    const [hasFlowers, setHasFlowers] = useState<boolean>(false);
    const [hasBarbs, setHasBarbs] = useState<boolean>(false);
    const [hasHairs, setHasHairs] = useState<boolean>(false);
    const [hasThorns, setHasThorns] = useState<boolean>(false);

    console.log(userData, "userData");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Leaf Section */}
                <h3>Leaf</h3>
                <div>
                    <input name="leafShape" type="text" placeholder="Shape (e.g. oval, lanceolate)" className="w-full" required />
                </div>
                <div>
                    <input name="leafSize" type="text" placeholder="Size (cm)" className="w-full" required />
                </div>
                <div>
                    <input name="leafArrangement" type="text" placeholder="Arrangement (e.g. alternate, opposite)" className="w-full" required />
                </div>
                <div>
                    <input name="leafFinish" type="text" placeholder="Finish (e.g. waxy, rough)" className="w-full" required />
                </div>
                <div>
                    <label>
                        <input
                            name="hasSegments"
                            type="checkbox"
                            onChange={(e) => setHasSegments(e.target.checked)}
                        />{" "}
                        Has Segments
                    </label>
                </div>
                {hasSegments && (
                    <div>
                        <input name="segmentCount" type="number" placeholder="Segment count" className="w-full" required />
                    </div>
                )}

                {/* Stems and Branches */}
                <h3>Stems and Branches</h3>
                <div>
                    <label>
                        <input
                            name="hasBranch"
                            type="checkbox"
                            onChange={(e) => setHasBranch(e.target.checked)}
                        />{" "}
                        Branch
                    </label>
                </div>
                {hasBranch && (
                    <>
                        <div>
                            <input name="branchSize" type="text" placeholder="Size (e.g. 10 cm)" className="w-full" required />
                        </div>
                        <div>
                            <input name="branchColor" type="text" placeholder="Color (e.g. brown, green)" className="w-full" required />
                        </div>
                        <div>
                            <input name="branchShape" type="text" placeholder="Shape (e.g. twisted, straight)" className="w-full" required />
                        </div>
                        <div>
                            <input name="branchDescription" type="text" placeholder="Optional: description" className="w-full" />
                        </div>
                    </>
                )}
                <div>
                    <label>
                        <input
                            name="hasStem"
                            type="checkbox"
                            onChange={(e) => setHasStem(e.target.checked)}
                        />{" "}
                        Stem
                    </label>
                </div>
                {hasStem && (
                    <>
                        <div>
                            <input name="stemSize" type="text" placeholder="Size (cm)" className="w-full" required />
                        </div>
                        <div>
                            <input name="stemColor" type="text" placeholder="Color (e.g. green, purple)" className="w-full" required />
                        </div>
                        <div>
                            <input name="stemShape" type="text" placeholder="Shape (e.g. twisted, straight)" className="w-full" required />
                        </div>
                        <div>
                            <input name="stemDescription" type="text" placeholder="Optional: description" className="w-full"/>
                        </div>
                    </>
                )}

                {/* Fruits and Flowers */}
                <div>
                    <h3>Fruits and Flowers</h3>
                    <p className="text-sm">*Do not taste the fruit unless you're 100% sure of the species</p>
                </div>
                <div>
                    <label>
                        <input
                            name="hasFruits"
                            type="checkbox"
                            onChange={(e) => setHasFruits(e.target.checked)}
                        />{" "}
                        Fruits
                    </label>
                </div>
                {hasFruits && (
                    <>
                        <div>
                            <input name="fruitSize" type="text" placeholder="Size (cm)" className="w-full" required />
                        </div>
                        <div>
                            <input name="fruitColor" type="text" placeholder="Color (e.g. red, yellow)" className="w-full" required />
                        </div>
                        <div>
                            <input name="fruitShape" type="text" placeholder="Shape (e.g. round, oblong)" className="w-full" required />
                        </div>
                        <div>
                            <input name="fruitDescription" type="text" placeholder="Optional: description" className="w-full"/>
                        </div>
                    </>
                )}
                <div>
                    <label>
                        <input
                            name="hasFlowers"
                            type="checkbox"
                            onChange={(e) => setHasFlowers(e.target.checked)}
                        />{" "}
                        Flowers
                    </label>
                </div>
                {hasFlowers && (
                    <>
                        <div>
                            <input name="flowerSize" type="text" placeholder="Size (cm)" className="w-full" required />
                        </div>
                        <div>
                            <input name="petalArrangement" type="text" placeholder="Petal arrangement (e.g. radial, bilateral)" className="w-full" required />
                        </div>
                        <div>
                            <input name="stamenDetails" type="text" placeholder="Stamen details (e.g. number, color)" className="w-full" required />
                        </div>
                        <div>
                            <input name="flowerColor" type="text" placeholder="Flower color (e.g. white, blue)" className="w-full" required />
                        </div>
                        <div>
                            <input name="flowerArrangement" type="text" placeholder="Flower arrangement (e.g. clusters, solitary)" className="w-full" required />
                        </div>
                        <div>
                            <input name="flowerDescription" type="text" placeholder="Optional: description" className="w-full"/>
                        </div>
                    </>
                )}

                {/* Barbs, Hairs, or Thorns */}
                <h3>Barbs, Hairs, or Thorns</h3>
                <div className="space-x-3">
                    <label>
                        <input
                            name="hasBarbs"
                            type="checkbox"
                            onChange={(e) => setHasBarbs(e.target.checked)}
                        />{" "}
                        Barbs
                    </label>
                    <label>
                        <input
                            name="hasHairs"
                            type="checkbox"
                            onChange={(e) => setHasHairs(e.target.checked)}
                        />{" "}
                        Hairs
                    </label>
                    <label>
                        <input
                            name="hasThorns"
                            type="checkbox"
                            onChange={(e) => setHasThorns(e.target.checked)}
                        />{" "}
                        Thorns
                    </label>
                </div>
                {(hasBarbs || hasHairs || hasThorns) && (
                    <div>
                        <input
                            name="barbsHairsThornsDescription"
                            className="w-full"
                            type="text"
                            placeholder="Optional: Description of barbs, hairs, or thorns"
                        />
                    </div>
                )}

                {/* Environmental Conditions */}
                <h3>Environmental Conditions (Feels Like)</h3>
                <div>
                    <input name="weather" type="text" placeholder="Weather (e.g. raining, sunny but cold, cloudy and humid)" className="w-full" required />
                </div>
                <div>
                    <input name="humidityLevel" type="text" placeholder="Humidity level (e.g. high, low)" className="w-full" required />
                </div>
                <div>
                    <input name="temperature" type="text" placeholder="Temperature (feels like)" className="w-full" />
                </div>

                <div>
                    <ActionButton label="Mark" loading={loading} />
                </div>
            </form>
        </>
    );
}
