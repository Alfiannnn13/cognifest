// "use client";

// import { useUploadThing } from "@/lib/uploadthing";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { eventFormSchema } from "@/lib/validator";
// import { eventDefaultValues } from "@/constans";
// import Dropdown from "./Dropdown";
// import { Textarea } from "../ui/textarea";
// import { FileUploader } from "./FileUploader";
// import { useState } from "react";
// import Image from "next/image";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Checkbox } from "../ui/checkbox";
// import { useRouter } from "next/navigation";
// import { createEvent } from "@/lib/actions/event.actions";

// type EventFormProps = {
//   userId: string;
//   type: "Create" | "Update";
// };

// const EventForm = ({ userId, type }: EventFormProps) => {
//   const [files, setFiles] = useState<File[]>([]);

//   const initialValues = eventDefaultValues;
//   const router = useRouter();
//   const { startUpload } = useUploadThing("imageUploader");

//   const form = useForm<z.infer<typeof eventFormSchema>>({
//     resolver: zodResolver(eventFormSchema),
//     defaultValues: initialValues,
//   });

//   async function onSubmit(values: z.infer<typeof eventFormSchema>) {
//     let uploadedImageUrl = values.imageUrl;

//     if (files.length > 0) {
//       const uploadedImages = await startUpload(files);

//       if (!uploadedImages) {
//         return;
//       }

//       uploadedImageUrl = uploadedImages[0].ufsUrl;
//     }
//     if (type === "Create") {
//       try {
//         const newEvent = await createEvent({
//           event: { ...values, imageUrl: uploadedImageUrl },
//           userId,
//           path: "/profile",
//         });

//         if (newEvent) {
//           form.reset();
//           router.push(`/events/${newEvent._id}`);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     console.log(values);
//   }
//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex flex-col gap-5"
//       >
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <Input
//                     placeholder="Event title"
//                     {...field}
//                     className="input-field"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="categoryId"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <Dropdown
//                     onChangeHandler={field.onChange}
//                     value={field.value}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl className="h-72">
//                   <Textarea
//                     placeholder="Description"
//                     {...field}
//                     className="textarea rounded-2xl"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="imageUrl"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl className="h-72">
//                   <FileUploader
//                     onFieldChange={field.onChange}
//                     imageUrl={field.value}
//                     setFiles={setFiles}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         {/* Location */}
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="location"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/location.svg"
//                       alt="location"
//                       width={24}
//                       height={24}
//                     />
//                     <Input
//                       placeholder="Event location or online"
//                       {...field}
//                       className="input-field"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         {/* start date */}
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="startDateTime"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/calendar.svg"
//                       alt="location"
//                       width={24}
//                       height={24}
//                     />
//                     <p className="ml-3 whitespace-nowrap text-grey-600">
//                       Start date:
//                     </p>
//                     <DatePicker
//                       selected={field.value}
//                       onChange={(date: Date | null) => {
//                         if (date !== null) field.onChange(date);
//                       }}
//                       showTimeSelect
//                       timeInputLabel="Time:"
//                       dateFormat="dd/MM/yyyy h:m aa"
//                       wrapperClassName="datePicker"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* end date */}

//           <FormField
//             control={form.control}
//             name="startDateTime"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/calendar.svg"
//                       alt="location"
//                       width={24}
//                       height={24}
//                     />
//                     <p className="ml-3 whitespace-nowrap text-grey-600">
//                       End date:
//                     </p>
//                     <DatePicker
//                       selected={field.value}
//                       onChange={(date: Date | null) => {
//                         if (date !== null) field.onChange(date);
//                       }}
//                       showTimeSelect
//                       timeInputLabel="Time:"
//                       dateFormat="dd/MM/yyyy h:m aa"
//                       wrapperClassName="datePicker"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
//                     <Image
//                       src="/assets/icons/dollar.svg"
//                       alt="dollar"
//                       width={24}
//                       height={24}
//                     />
//                     <Input
//                       type="number"
//                       placeholder="30.000"
//                       {...field}
//                       className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="isFree"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <div className="flex items-center">
//                     <label
//                       htmlFor="isFree"
//                       className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                     >
//                       Free Ticket
//                     </label>
//                     <Checkbox
//                       onCheckedChange={field.onChange}
//                       checked={field.value}
//                       id="isFree"
//                       className="mr-2 h-5 w-5 border-2 border-primary-500"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="url"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormControl>
//                   <Input placeholder="URL" {...field} className="input-field" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Button
//           type="submit"
//           size="lg"
//           disabled={form.formState.isSubmitting}
//           className="button col-span-2 w-full"
//         >
//           {form.formState.isSubmitting ? "Submitting..." : `${type} Event`}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default EventForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from "@/lib/validator";
import * as z from "zod";
import Dropdown from "./Dropdown";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { useUploadThing } from "@/lib/uploadthing";

import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { IEvent } from "@/lib/database/models/event.model";
import { eventDefaultValues } from "@/constans";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
};

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const initialValues =
    event && type === "Update"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues;
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].ufsUrl;
    }

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: "/profile",
        });

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
          path: `/events/${eventId}`,
        });

        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Event title"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />

                    <Input
                      placeholder="Event location or Online"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Start Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => {
                        if (date !== null) field.onChange(date);
                      }}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="dd/MM/yyyy h:m aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      End Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => {
                        if (date !== null) field.onChange(date);
                      }}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="dd/MM/yyyy h:m aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    />

                    <Input
                      placeholder="URL"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="quota"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Kuota"
                    {...field}
                    value={field.value ?? ""} // biar gak error waktu value kosong
                    onChange={
                      (e) => field.onChange(e.target.valueAsNumber) // 💡 Ini yang penting!
                    }
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event `}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
