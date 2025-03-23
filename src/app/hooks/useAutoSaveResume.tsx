import useDebounce from "@/app/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { saveResume } from "../../../actions/actions";

const useAutoSaveResume = (resumeData: ResumeValues) => {
  const searchParams = useSearchParams();
  const debouncedResumeData = useDebounce(resumeData, 1500);
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData)
  );
  const [resumeId, setResumeId] = useState(resumeData?.id);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);
  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);
        const newData = structuredClone(debouncedResumeData);
        const updatedResume = await saveResume({
          ...newData,
          ...(lastSavedData.photo?.toString() === newData.photo?.toString() && {
            photo: undefined,
          }),
          id: resumeId,
        });
        setResumeId(updatedResume.id);
        setLastSavedData(newData);
        setIsSaving(false);
        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
        }
      } catch (error) {
        setIsError(true);
      }

      setLastSavedData(structuredClone(debouncedResumeData));
    }
    const hasUnsavedChanges =
      JSON.stringify(lastSavedData) !== JSON.stringify(debouncedResumeData);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving) save();
  }, [debouncedResumeData, isSaving, lastSavedData]);
  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(lastSavedData) !== JSON.stringify(resumeData),
  };
};

export default useAutoSaveResume;
