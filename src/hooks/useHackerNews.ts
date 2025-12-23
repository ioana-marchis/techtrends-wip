import { useQuery } from "@tanstack/react-query";

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
}

interface ProcessedTrend {
  title: string;
  category: string;
  description: string;
  growth: number;
  mentions: string;
  sentiment: "positive" | "negative" | "neutral";
  url?: string;
}

const categorizeStory = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("ai") || lowerTitle.includes("ml") || lowerTitle.includes("gpt") || lowerTitle.includes("llm") || lowerTitle.includes("machine learning") || lowerTitle.includes("neural")) {
    return "AI & ML";
  }
  if (lowerTitle.includes("cloud") || lowerTitle.includes("aws") || lowerTitle.includes("azure") || lowerTitle.includes("kubernetes") || lowerTitle.includes("docker")) {
    return "Cloud";
  }
  if (lowerTitle.includes("security") || lowerTitle.includes("hack") || lowerTitle.includes("vulnerability") || lowerTitle.includes("breach") || lowerTitle.includes("privacy")) {
    return "Security";
  }
  if (lowerTitle.includes("devops") || lowerTitle.includes("ci/cd") || lowerTitle.includes("deploy") || lowerTitle.includes("infrastructure")) {
    return "DevOps";
  }
  if (lowerTitle.includes("crypto") || lowerTitle.includes("blockchain") || lowerTitle.includes("web3") || lowerTitle.includes("nft") || lowerTitle.includes("defi")) {
    return "Web3";
  }
  return "Other"; // Default category for non-tech stories
};

const getSentiment = (score: number): "positive" | "negative" | "neutral" => {
  if (score > 200) return "positive";
  if (score > 50) return "neutral";
  return "negative";
};

const formatMentions = (descendants: number): string => {
  if (descendants >= 1000) return `${(descendants / 1000).toFixed(1)}K`;
  return `${descendants}`;
};

const fetchStory = async (id: number): Promise<HNStory> => {
  console.log(`[HN API] Fetching story with ID: ${id}`);
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  if (!response.ok) {
    console.error(`[HN API] Failed to fetch story ${id}:`, response.status);
    throw new Error("Failed to fetch story");
  }
  const story = await response.json();
  console.log(`[HN API] Story ${id} fetched:`, story);
  return story;
};

const fetchTopStories = async (): Promise<ProcessedTrend[]> => {
  // Fetch top story IDs
  console.log('[HN API] Fetching top stories IDs...');
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  if (!response.ok) {
    console.error('[HN API] Failed to fetch top stories:', response.status);
    throw new Error("Failed to fetch top stories");
  }
  
  const storyIds: number[] = await response.json();
  console.log(`[HN API] Received ${storyIds.length} story IDs:`, storyIds.slice(0, 20));
  
  // Fetch first 20 stories
  console.log('[HN API] Fetching details for first 20 stories...');
  const stories = await Promise.all(
    storyIds.slice(0, 20).map(fetchStory)
  );
  console.log(`[HN API] Successfully fetched ${stories.length} stories`);
  
  // Process and transform stories
  const processedTrends = stories
    .filter(story => story && story.title)
    .map((story, index) => ({
      title: story.title,
      category: categorizeStory(story.title),
      description: `Trending on HackerNews with ${story.score} points. Posted by ${story.by}.`,
      growth: Math.max(5, Math.floor((story.score / (index + 1)) / 10)),
      mentions: formatMentions(story.descendants || 0),
      sentiment: getSentiment(story.score),
      url: story.url,
    }));
  
  console.log('[HN API] Processed trends:', processedTrends);
  return processedTrends;
};

interface TopTrend {
  rank: number;
  name: string;
  category: string;
  score: number;
  hot: boolean;
  url?: string;
}

const fetchTopTrends = async (): Promise<TopTrend[]> => {
  console.log('[HN API - Top Trends] Fetching top stories IDs for sidebar...');
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  if (!response.ok) {
    console.error('[HN API - Top Trends] Failed to fetch:', response.status);
    throw new Error("Failed to fetch");
  }
  
  const storyIds: number[] = await response.json();
  console.log(`[HN API - Top Trends] Received ${storyIds.length} story IDs, taking first 5:`, storyIds.slice(0, 5));
  
  console.log('[HN API - Top Trends] Fetching details for top 5 stories...');
  const stories = await Promise.all(storyIds.slice(0, 5).map(fetchStory));
  console.log(`[HN API - Top Trends] Successfully fetched ${stories.length} stories`);
  
  const topTrends = stories.map((story, index) => ({
    rank: index + 1,
    name: story.title.length > 40 ? story.title.substring(0, 40) + "..." : story.title,
    category: categorizeStory(story.title),
    score: story.score,
    hot: story.score > 200,
    url: story.url,
  }));
  
  console.log('[HN API - Top Trends] Processed top trends:', topTrends);
  return topTrends;
};

export const useHackerNewsTrends = () => {
  return useQuery({
    queryKey: ["hackerNewsTrends"],
    queryFn: fetchTopStories,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // 1 hour
  });
};

export const useHackerNewsTopTrends = () => {
  return useQuery({
    queryKey: ["hackerNewsTopTrends"],
    queryFn: fetchTopTrends,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // 1 hour
  });
};
