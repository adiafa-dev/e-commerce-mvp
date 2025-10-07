import SocialMediaList from './SocialMediaList';

export default function SocialMedia() {
  return (
    <>
      <div>
        <h4 className="font-bold pb-5">Follow on Social Media</h4>
        <div className="flex gap-5">
          <SocialMediaList />
        </div>
      </div>
    </>
  );
}
