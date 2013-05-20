<?php

namespace Kendoctor\Bundle\NodeBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class PageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title','hidden')
            ->add('body')
            ->add('category')
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Kendoctor\Bundle\NodeBundle\Entity\Page'
        ));
    }

    public function getName()
    {
        return 'kendoctor_bundle_nodebundle_pagetype';
    }
}
