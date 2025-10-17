const TABS = { 
    TWEETS: 'tweets',
    FOLLOWERS: 'followers',
    FOLLOWING: 'following'
};
const ProfileStats = ({ postCount, followersCount, followingCount,selectedTab,onTabChange }) => {
  const stats = [
    { label: "tweets", count: postCount || 0, tabId: TABS.TWEETS },
    { label: "followers", count: followersCount || 0, tabId: TABS.FOLLOWERS },
    { label: "following", count: followingCount || 0, tabId: TABS.FOLLOWING },
  ];
  

  return (
    <div className="flex justify-around mt-6 py-4">
      {stats.map((stat, index) => (
        <button
          key={stat.label}
          onClick={() => onTabChange(stat.tabId)} 
          className={`
            py-3 px-4 text-center transition-colors duration-150
            ${selectedTab === stat.tabId
              ? "text-blue-500 border-b-2 border-blue-500 font-bold"
              : "text-gray-500 hover:bg-gray-100 font-medium"
            }
          `}
        >
          <p className="font-semibold">{stat.count}</p>
          <p className="text-gray-500 text-sm">{stat.label}</p>
        </button>
      ))}
    </div>
  );
};

export default ProfileStats;