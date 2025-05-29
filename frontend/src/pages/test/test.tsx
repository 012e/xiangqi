import { HoverCardMe, MyHoverCard } from '@/components/play/my-hover-card.tsx';


export default function Demo() {

  return (
    <div className="flex gap-5">
      <myHoverCard props={{
        name: 'test',
        image: 'https://placehold.co/50',
        score: 100,
      }}/>
      <HoverCardMe props={
        {
          name: 'test',
          image: 'https://placehold.co/50',
          score: 100,
        }
      }/>
    </div>
  );
}
