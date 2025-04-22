"use client"

import { Routes } from '@/enums/routes';
import { useProfile } from '@/providers/ProfileProvider';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from "next/navigation";


export default function HomePage() {
	const { userData } = useProfile();

	const router = useRouter();
	

	const handleRoute = () => {
		if (userData) {
			router.push(Routes.TAKENOTE);
		}
		router.push(Routes.SIGNUP);
	};

	return (
		<div className="p-4 space-y-2 card">
			<p> 
				Slo-id focuses on identification in depth, avoiding misidentifications by examining key details, 
				and tracking sightings to understand each species fits in. 
			</p>
			<p>
				Mark sightings, one id at a time.
			</p>
			<div className="flex items-center justify-between pt-4">
				<button onClick={handleRoute} className="ml-auto">
					<div className="flex items-end">
						<h4>Identify</h4>
						<NavigateNextIcon></NavigateNextIcon>
					</div>
				</button>
			</div>
		</div>
	);
}
