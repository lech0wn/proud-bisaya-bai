import Image from "next/image";

export default function Home() {

  const setNewView = async () =>(
     console.log('new view')
  );

  setNewView();
  return (
    <div>hello</div>
  );
}
