import { getHomePlaylist } from '@/lib/bold'
import BackgroundVideo from '@/components/video/BackgroundVideo'

export default async function IndexPage() {
  const playlist = await getHomePlaylist()
  return <div>{playlist.length > 0 && <BackgroundVideo playlist={playlist} />}</div>
}
