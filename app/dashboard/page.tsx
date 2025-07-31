"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import {getAllFreelancers} from "@/app/service/freelancer.service";

interface Skill {
    id: number;
    description: string;
}
interface FreelancerFilter {
  location?: string;
  timezone?: string;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  ratingMin?: number;
  availableOnly?: boolean;
  skills?: string[];
}

interface Freelancer {
  id: number;
  name: string;
  location: string;
  timezone: string;
  hourlyRate: number;
  rating: number;
  available: boolean;
  skills: Skill[];
}

export default function DashboardPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FreelancerFilter>({
    hourlyRateMin: 0,
    hourlyRateMax: 150,
    ratingMin: 0,
    availableOnly: false,
    skills: [] as string[],
  })

  // Get unique values for filter options
  const uniqueLocations = Array.from(new Set(freelancers.map((f) => f.location))).sort()
  const uniqueTimezones = Array.from(new Set(freelancers.map((f) => f.timezone))).sort()
  const allSkills = freelancers
      .flatMap(f => f.skills)
      .reduce((acc: { id: number, description: string }[], skill) => {
        if (!acc.find(s => s.id === skill.id)) {
          acc.push(skill);
        }
        return acc;
      }, [])
      .sort((a, b) => a.description.localeCompare(b.description));

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (!isAuthenticated) {
      router.push("/")
      return
    }

    if (email) {
      setUserEmail(email)
    }
  }, [router])

  useEffect(() => {
    console.info("Fetching freelancers with filters:", filters)
    getAllFreelancers(1, 10, filters)
      .then((data) => {
        console.info("Fetched freelancers:", data)
        setFreelancers(data)
      })
      .catch((error) => {
        console.error("Error fetching freelancers:", error)
      })
  }, [filters])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("accessToken")
    router.push("/")
  }

  const resetFilters = () => {
    setFilters({
      hourlyRateMin: 0,
      hourlyRateMax: 150,
      ratingMin: 0,
      availableOnly: false,
      skills: [],
      timezone: undefined,
      location: undefined,
    })
    setSearchTerm("")
  }

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills?.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills || [], skill],
    }))
  }

  const availableFreelancers = freelancers.filter((f) => f.available).length
  const totalFreelancers = freelancers.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">FreelanceHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, {userEmail}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Freelancers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFreelancers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Freelancers</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableFreelancers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Availability Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((availableFreelancers / totalFreelancers) * 100)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Filters</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs bg-transparent">
                  <X className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Location Filter */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timezone Filter */}
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={filters.timezone}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All timezones" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueTimezones.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Available Only Toggle */}
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      checked={filters.availableOnly}
                      onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, availableOnly: checked }))}
                    />
                    <span className="text-sm">Available only</span>
                  </div>
                </div>
              </div>

              {/* Hourly Rate Range */}
              <div className="space-y-2">
                <Label>
                  Hourly Rate: ${filters.hourlyRateMin} - ${filters.hourlyRateMax}
                </Label>
                <div className="px-2">
                  <Slider
                    value={[filters.hourlyRateMin || 0, filters.hourlyRateMax || 100]}
                    onValueChange={([min, max]) =>
                      setFilters((prev) => ({ ...prev, hourlyRateMin: min, hourlyRateMax: max }))
                    }
                    max={150}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2">
                <Label>Rating min: {'>'} {filters.ratingMin}</Label>
                <div className="px-2">
                  <Slider
                      value={[filters.ratingMin || 0]}
                      onValueChange={([min]) =>
                          setFilters((prev) => ({ ...prev, ratingMin: min }))
                      }
                      max={5}
                      min={0}
                      step={0.1}
                      className="w-full"
                  />
                </div>
              </div>

              {/* Skills Filter */}
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <Badge
                      key={skill.description}
                      variant={filters.skills?.includes(skill.description) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => toggleSkill(skill.description)}
                    >
                      {skill.description}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle>Freelancers List</CardTitle>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Freelancer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timezone</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skills</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {freelancers.map((freelancer) => (
                    <TableRow key={freelancer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={"/placeholder.svg"} />
                            <AvatarFallback>
                              {freelancer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{freelancer.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{freelancer.location}</TableCell>
                      <TableCell className="text-sm text-gray-600">{freelancer.timezone}</TableCell>
                      <TableCell className="font-medium">${freelancer.hourlyRate}/hr</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{freelancer.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={freelancer.available ? "default" : "secondary"}
                          className={freelancer.available ? "bg-green-100 text-green-800" : ""}
                        >
                          {freelancer.available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {freelancer.skills?.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill.description}
                            </Badge>
                          ))}
                          {freelancer.skills?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{freelancer.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {freelancers.length === 0 && (
              <div className="text-center py-8 text-gray-500">No freelancers found matching your search criteria.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
