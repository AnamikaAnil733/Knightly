import React, { useEffect, useState } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import { userAchievementApi, AchievementProgress } from '../../../Service/Api/UserAchievementApi';
import AchievementCard from './AchievementCard';

export const AchievementSection: React.FC = () => {
    const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const data = await userAchievementApi.getAllAchievements();
            setAchievements(data);
        } catch (error) {
            console.error("Error fetching achievements:", error);
        } finally {
            setLoading(false);
        }
    };

    const earnedCount = achievements.filter(a => a.isEarned).length;
    const totalCount = achievements.length;

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Polishing your trophies...</p>
            </div>
        );
    }

    if (achievements.length === 0) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                        <Trophy className="text-yellow-500" size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                            Trophy Room
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            Displaying your legendary milestones and collection.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800/50 flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Unlocked</p>
                        <p className="text-lg font-black text-yellow-500">{earnedCount} / {totalCount}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-800" />
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Completion</p>
                        <p className="text-lg font-black text-white">{Math.round((earnedCount/totalCount)*100)}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        {...achievement}
                    />
                ))}
            </div>
        </div>
    );
};
