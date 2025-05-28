import { HoverCardMe, HoverCardOpponent } from '@/components/play/hover-card.tsx';


export default function Demo() {

  return (
    <div className="flex gap-5">
      <HoverCardOpponent props={{
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
