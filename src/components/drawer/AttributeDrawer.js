import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
//internal import
import { useTranslation } from "react-i18next";
import useAttributeSubmit from "hooks/useAttributeSubmit";
import Title from "components/form/Title";
import LabelArea from "components/form/LabelArea";
import InputArea from "components/form/InputArea";
import { Textarea } from "@windmill/react-ui";
import Error from "components/form/Error";
import DrawerButton from "components/form/DrawerButton";
import Uploader from "components/image-uploader/Uploader";

const AttributeDrawer = ({ id }) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    errors,
    isSubmitting,
    imageUrl,
    setImageUrl,
    handleSelectLanguage,
  } = useAttributeSubmit(id);

  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateAttribute")}
            description={t("UpdateAttributeDesc")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddAttribute")}
            description={t("AddAttributeDesc")}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Brand Logo" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  // product
                  // folder="brand"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
              <LabelArea label="Brand Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Brand Name"
                  name="name"
                  type="text"
                  placeholder="Brand Name"
                />
                <Error errorName={errors.name} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
              <LabelArea label="Brand Slug" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Brand Slug"
                  name="slug"
                  type="text"
                  placeholder="Brand Slug"
                />
                <Error errorName={errors.slug} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Title" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Brand Title"
                />
                <Error errorName={errors.title} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Brand Description" />
              <div className="col-span-8 sm:col-span-4">
                <Textarea
                  className="border text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  {...register("content", {
                    required: "Brand Description is required.",
                  })}
                  name="content"
                  placeholder="Brand Description"
                  rows="4"
                  spellCheck="false"
                />
                <Error errorName={errors.content} />
              </div>
            </div>
          </div>
          <DrawerButton id={id} title="Brand" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default AttributeDrawer;
