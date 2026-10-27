import { BookOpenIcon, SearchIcon, ChartIcon, HeartIcon } from "./Icons";

// Each item gets an icon and a soft background tint
const features = [
    { icon: BookOpenIcon, title: "Build your library", text: "Keep all your books in one place.", tint: "bg-rl-sage-soft text-rl-sage" },
    { icon: SearchIcon, title: "Discover new reads", text: "Find books you'll love.", tint: "bg-rl-rose-soft text-rl-primary" },
    { icon: ChartIcon, title: "Track your progress", text: "See how far you've come.", tint: "bg-rl-sage-soft text-rl-sage" },
    { icon: HeartIcon, title: "Make it yours", text: "Set goals, get recommendations.", tint: "bg-rl-rose-soft text-rl-primary" },
];

export default function FeatureStrip() {
    return (
        <section id="features" className="bg-rl-alt">
            <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(({ icon: Icon, title, text, tint }) => (
                    <div key={title} className="flex items-center gap-4">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tint}`}>
                            <Icon />
                        </span>
                        <div>
                            <h3 className="text-sm font-medium">{title}</h3>
                            <p className="text-xs text-rl-muted">{text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}