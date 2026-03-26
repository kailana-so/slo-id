import { useProfile } from "@/providers/ProfileProvider";
import DrawIcon from '@mui/icons-material/Draw';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HikingIcon from '@mui/icons-material/Hiking';

export default function ProfilePage() {
    const { userData, loading } = useProfile();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="spinner"></div>
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    return (
        <div>
            {userData?.username ? (
                <section>
                    <div className="card">
                        <h3>Hi {userData.username}</h3>
                    </div>
                    <div className="card">
                        <h3>Trends</h3>
                        <section className="badge-grid">
                            <div className="trend-item">
                                <SearchIcon />
                                <p className="hidden sm:block">Notes</p>
                            </div>
                            <div className="trend-item">
                                <DrawIcon />
                                <p className="hidden sm:block">Drafts</p>
                            </div>
                            <div className="trend-item">
                                <CheckCircleIcon />
                                <p className="hidden sm:block">Ids</p>
                            </div>
                            <div className="trend-item">
                                <HikingIcon />
                                <p className="hidden sm:block">Distance</p>
                            </div>
                        </section>
                    </div>
                </section>
            ) : (
                <div>
                    <p>Create a profile to start noticing.</p>
                </div>
            )}
        </div>
    );
}
