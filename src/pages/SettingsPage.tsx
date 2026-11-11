import { useMe } from "@/features/auth";
import { PasswordCard, PersonalDataCard, PreferencesCard } from "@/features/settings";
import { Loader, PageHeader } from "@/shared/ui";

function SettingsPage() {
  const { data: user, isPending } = useMe();

  return (
    <div>
      <PageHeader
        title="Налаштування профілю"
        subtitle="Ваш простір, ваші вподобання та безпека."
      />

      {isPending && <Loader />}

      {/* форми беруть початкові значення з юзера, тому монтуємо їх, коли він уже є */}
      {user && (
        <div className="mx-10 mb-10 grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-5">
            <PersonalDataCard user={user} />
            <PasswordCard />
          </div>

          <PreferencesCard user={user} />
        </div>
      )}
    </div>
  )
}

export default SettingsPage
