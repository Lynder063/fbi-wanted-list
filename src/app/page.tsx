"use client";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Definujeme typ pro hledanou osobu
interface WantedPerson {
  uuid: string;
  title: string;
  images: { original: string }[];
  url: string;
  age_range?: string;
  race_raw?: string;
  height?: string;
  weight?: string;
  dates_of_birth_used?: string[];
  publication: string;
  poster_classification?: string;
}

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1);
  const [wanted, setWanted] = useState<WantedPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPersons = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.fbi.gov/wanted/v1/list?page=${currentPage}`
        );
        const data = await response.json();
        console.log(data);
        setWanted(data.items || []);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersons();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredWanted = useMemo(() => {
    return wanted.filter((person) =>
      person.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [wanted, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">FBI Wanted</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search wanted persons..."
              className="bg-primary-foreground/10 text-primary-foreground pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-background p-6">
        {isLoading ? (
          <div className="text-white flex justify-center items-center h-full">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredWanted.map((person) => (
              <Card
                key={person.uuid}
                className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md"
              >
                <Link href={person.url}>
                  <img
                    src={person.images[0]?.original}
                    alt={`Wanted Person - ${person.title}`}
                    width={500}
                    height={500}
                    className="w-full h-80 object-cover"
                    loading="lazy"
                    style={{ aspectRatio: "500/500", objectFit: "cover" }}
                  />
                  <CardContent className="p-4 grid gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{person.title}</h2>
                      <div className="bg-red-700 text-primary-foreground px-2 py-1 rounded-full text-base font-medium">
                        Wanted
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-lg text-muted-foreground">
                      <div>
                        <span className="font-semibold">Age:</span>{" "}
                        {person.age_range || "Undefined"}
                      </div>
                      <div>
                        <span className="font-semibold">Race:</span>{" "}
                        {person.race_raw || "Undefined"}
                      </div>
                      <div>
                        <span className="font-semibold">Height:</span>{" "}
                        {person.height || "Undefined"}
                      </div>
                      <div>
                        <span className="font-semibold">Weight:</span>{" "}
                        {person.weight || "Undefined"}
                      </div>
                      <div>
                        <span className="font-semibold">Birth:</span>{" "}
                        {person.dates_of_birth_used?.[0] || "Undefined"}
                      </div>
                      <div>
                        <span className="font-semibold">Published:</span>{" "}
                        {new Intl.DateTimeFormat("cs-CZ").format(
                          new Date(person.publication)
                        )}
                      </div>
                    </div>
                    <div className="text-2xl">
                      <span className="font-semibold">Crime:</span>{" "}
                      {person.poster_classification || "Undefined"}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
      <footer className="bg-muted text-muted-foreground p-4 text-sm flex justify-center items-center gap-4">
        {Array.from(
          { length: Math.ceil((filteredWanted?.length || 0) / 4) },
          (_, i) => i + 1
        ).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
            className="px-4 py-2 rounded-md"
          >
            {page}
          </Button>
        ))}
      </footer>
    </div>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // Můžete přidat další vlastnosti, pokud je potřebujete
}

function FilterIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function SearchIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
