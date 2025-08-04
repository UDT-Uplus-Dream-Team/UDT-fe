'use client';

import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Calendar, Clock, Users, Globe, Play } from 'lucide-react';
import Image from 'next/image';
import type { Content } from '@type/admin/Content';

interface ContentDetailProps {
  content: Content;
  onEdit: () => void;
  onClose: () => void;
}

export default function ContentDetail({
  content,
  onEdit,
  onClose,
}: ContentDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{content.openDate?.split('T')[0] || ''}</span>
            </div>
            {content.runningTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {content.runningTime}분
              </div>
            )}
            {content.episode > 0 && (
              <div className="flex items-center gap-1">
                <span>{content.episode}화</span>
              </div>
            )}
            <Badge>{content.rating}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit} className="cursor-pointer">
            수정
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            닫기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {content.posterUrl && (
            <Image
              src={content.posterUrl || '/placeholder.svg'}
              alt={content.title}
              width={400}
              height={600}
              unoptimized
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview" className="cursor-pointer">
                개요
              </TabsTrigger>
              <TabsTrigger value="cast" className="cursor-pointer">
                출연진
              </TabsTrigger>
              <TabsTrigger value="platforms" className="cursor-pointer">
                플랫폼
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-3">
              <Card>
                <CardHeader>
                  <CardTitle className="mt-3">줄거리</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 leading-relaxed mb-3">
                    {content.description}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mt-3">
                      <Users className="h-5 w-5" />
                      감독
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-1 gap-4 mb-5">
                      {content.directors.map((director) => (
                        <div
                          key={director.directorId}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          {director.directorImageUrl ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                              <Image
                                src={director.directorImageUrl}
                                alt={director.directorName || '출연진 이미지'}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {director.directorName}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mt-3">
                      <Globe className="h-5 w-5" />
                      제작국가
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {content.countries.map((country, index) => (
                        <Badge key={index} variant="outline">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="mt-3">장르</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {content.categories.map((category, catIndex) => (
                      <div key={catIndex} className="flex flex-wrap gap-1 mb-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          {category.categoryType}
                        </Badge>
                        {category.genres.map((genre, genreIndex) => (
                          <Badge key={genreIndex} variant="secondary">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cast" className="space-y-4 mt-3">
              <Card>
                <CardHeader>
                  <CardTitle className="mt-3">출연진</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    {content.casts.map((cast) => (
                      <div
                        key={cast.castId}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        {cast.castImageUrl ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={cast.castImageUrl}
                              alt={cast.castName || '출연진 이미지'}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{cast.castName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-4 mt-3">
              <Card>
                <CardHeader>
                  <CardTitle className="mt-3">시청 가능 플랫폼</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-5">
                    {content.platforms.map((platform, index) => (
                      <a
                        key={index}
                        href={platform.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Play className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">
                              {platform.platformType}
                            </div>
                            <div className="text-sm text-gray-500">
                              {platform.watchUrl}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {content.trailerUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="mt-3">예고편</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={content.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3"
            >
              <Play className="h-4 w-4" />
              예고편 보기
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
