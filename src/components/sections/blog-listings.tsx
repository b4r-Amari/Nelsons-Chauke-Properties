
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { type BlogPost } from '@/components/shared/blog-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function BlogListings({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0);
  const [visiblePosts, setVisiblePosts] = useState(9); // 9 remaining stories

  const categories = useMemo(() => {
    const allCategories = initialPosts.map(post => post.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [initialPosts]);


  useEffect(() => {
    if (initialPosts.length === 0) {
      setIsLoading(true);
      // In a real scenario with client-only fetching, you would call getBlogPosts() here.
      // Since we pass initialPosts, we can assume they are loaded.
      setIsLoading(false);
    }
  }, [initialPosts]);

  useEffect(() => {
    let filtered = allPosts;
    
    if(selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    setFilteredPosts(filtered);
    setVisiblePosts(9); // Reset pagination on new search/filter
  }, [searchQuery, selectedCategory, allPosts]);

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 9);
  };

  if (isLoading) {
    return (
        <div className="container py-16">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2"><Skeleton className="h-[500px] w-full" /></div>
            <div className="space-y-8"><Skeleton className="h-[240px] w-full" /><Skeleton className="h-[240px] w-full" /></div>
          </div>
        </div>
    );
  }

  const TinyBlogCard = ({ post }: { post: BlogPost }) => (
    <Link href={`/blog/${post.slug}`} className="block group">
        <Card className="flex gap-4 shadow-md hover:shadow-xl transition-shadow duration-300">
             <div className="relative w-1/3 aspect-square shrink-0 overflow-hidden rounded-l-lg">
                 <Image src={post.imageUrl} alt={post.title} data-ai-hint={post.imageHint} fill className="object-cover group-hover:scale-105 transition-transform"/>
             </div>
             <CardContent className="py-4 pr-4 pl-0">
                 <h3 className="font-bold font-headline leading-tight mb-1 line-clamp-3">{post.title}</h3>
                 <p className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </CardContent>
        </Card>
    </Link>
  );

  const FullWidthBlogCard = ({ post }: { post: BlogPost }) => (
      <Link href={`/blog/${post.slug}`} className="block group">
        <Card className="flex flex-col sm:flex-row gap-4 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
             <div className="relative w-full sm:w-1/3 h-48 sm:h-auto shrink-0">
                 <Image src={post.imageUrl} alt={post.title} data-ai-hint={post.imageHint} fill className="object-cover group-hover:scale-105 transition-transform"/>
             </div>
             <CardContent className="p-4 sm:p-6 flex flex-col">
                 <h3 className="font-bold text-xl font-headline leading-tight mb-2 group-hover:text-brand-bright transition-colors">{post.title}</h3>
                 <p className="text-xs text-muted-foreground mb-3">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 flex-grow">{post.excerpt}</p>
             </CardContent>
        </Card>
      </Link>
  );

  const DesktopBlogCard = ({ post }: { post: BlogPost }) => (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={`Featured image for: ${post.title}`}
            data-ai-hint={post.imageHint}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold font-headline text-brand-deep mb-2 line-clamp-2 flex-grow group-hover:text-brand-bright transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.excerpt}</p>
          <p className="text-xs text-muted-foreground mt-auto">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold font-headline">Latest stories</h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="What are you looking for?"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="relative mb-12 border-b">
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-0">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant="ghost"
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "rounded-none px-4 py-6 hover:bg-transparent hover:shadow-[inset_0_-2px_0_0_hsl(var(--primary))] focus:shadow-[inset_0_-2px_0_0_hsl(var(--primary))]",
                            selectedCategory === category
                                ? "shadow-[inset_0_-2px_0_0_hsl(var(--accent))] text-brand-deep font-bold"
                                : "text-muted-foreground"
                        )}
                    >
                        {category}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Desktop Layout: 2-column grid */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.length > 0 ? filteredPosts.slice(0, visiblePosts).map((post) => (
              <DesktopBlogCard key={post.slug} post={post} />
          )) : (
            <div className="text-center py-16 text-muted-foreground col-span-full">
              <p>No more stories found for this category.</p>
            </div>
          )}
      </div>

      {/* Mobile and Tablet Layout */}
      <div className="grid grid-cols-1 gap-8 lg:hidden">
        {filteredPosts.length > 0 ? (
          <>
            {/* First 4 posts as full-width cards */}
            {filteredPosts.slice(0, 4).map((post) => (
              <FullWidthBlogCard key={post.slug} post={post} />
            ))}
            {/* Remaining posts as "tiny" cards in a 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredPosts.slice(4, visiblePosts + 4).map((post) => (
                <TinyBlogCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground col-span-full">
            <p>No stories found for this category.</p>
          </div>
        )}
      </div>
      
      {visiblePosts < filteredPosts.length && (
         <div className="text-center mt-12">
            <Button variant="outline" onClick={handleLoadMore}>Load more</Button>
        </div>
      )}
    </>
  );
}
